import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open (or create) the SQLite database
async function openDb() {
  return open({
    filename: './stats.sqlite',
    driver: sqlite3.Database,
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await openDb();
  await db.exec('CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY, type TEXT, ts DATETIME DEFAULT CURRENT_TIMESTAMP)');

  if (req.method === 'POST') {
    const { type } = req.body;
    if (!type) return res.status(400).json({ error: 'Missing type' });
    await db.run('INSERT INTO events (type) VALUES (?)', type);
    return res.status(201).json({ ok: true });
  }

  // GET: return event counts
  const rows = await db.all('SELECT type, COUNT(*) as count FROM events GROUP BY type');
  res.status(200).json({ stats: rows });
}
