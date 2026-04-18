import mysql from 'mysql2/promise'

// Connection pool configuration
const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
  } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
}

// Create connection pool
const pool = mysql.createPool(poolConfig)

/**
 * Execute a SQL query with parameters
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
export async function query(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

/**
 * Execute a SQL query without parameters (for complex queries)
 * @param {string} sql - SQL query string
 * @returns {Promise<Array>} Query results
 */
export async function queryRaw(sql) {
  try {
    const [results] = await pool.query(sql)
    return results
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

/**
 * Get a single connection from the pool
 * @returns {Promise<mysql.Connection>} Database connection
 */
export async function getConnection() {
  return await pool.getConnection()
}

/**
 * Test database connection
 * @returns {Promise<boolean>} Connection status
 */
export async function testConnection() {
  try {
    await pool.execute('SELECT 1')
    return true
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}

export default pool
