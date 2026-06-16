const { Router } = require('express');
const pool = require('../db');

const router = Router();

router.get('/', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT
      c.table_name,
      c.column_name,
      c.data_type,
      c.character_maximum_length,
      c.is_nullable,
      c.column_default,
      tc.constraint_type,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.columns c
    LEFT JOIN information_schema.key_column_usage kcu
      ON kcu.table_name = c.table_name
      AND kcu.column_name = c.column_name
      AND kcu.table_schema = c.table_schema
    LEFT JOIN information_schema.table_constraints tc
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = c.table_schema
    LEFT JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_name = tc.constraint_name
      AND tc.constraint_type = 'FOREIGN KEY'
    WHERE c.table_schema = 'public'
    ORDER BY c.table_name, c.ordinal_position
  `);

  const tables = {};
  for (const row of rows) {
    if (!tables[row.table_name]) {
      tables[row.table_name] = { table_name: row.table_name, columns: {} };
    }
    const col = tables[row.table_name].columns;
    if (!col[row.column_name]) {
      col[row.column_name] = {
        column_name: row.column_name,
        data_type: row.data_type,
        character_maximum_length: row.character_maximum_length,
        is_nullable: row.is_nullable,
        column_default: row.column_default,
        constraints: [],
      };
    }
    if (row.constraint_type) {
      const already = col[row.column_name].constraints.some(
        (c) => c.constraint_type === row.constraint_type && c.foreign_table_name === row.foreign_table_name
      );
      if (!already) {
        col[row.column_name].constraints.push({
          constraint_type: row.constraint_type,
          foreign_table_name: row.foreign_table_name || null,
          foreign_column_name: row.foreign_column_name || null,
        });
      }
    }
  }

  const result = Object.values(tables).map((t) => ({
    table_name: t.table_name,
    columns: Object.values(t.columns),
  }));

  res.json(result);
});

module.exports = router;
