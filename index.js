const https = require('https');
const crypto = require('crypto');
const { promisify } = require('util');
const fs = require('fs').promises;

/**
 * 时间格式化
 * @param {Date} [date=new Date()] - 要格式化的日期，默认为当前日期
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date = new Date()) {
  return date.toISOString();
}

/**
 * 获取环境变量值
 * @param {string} name - 环境变量名
 * @param {string} [defaultValue=''] - 默认值（如果环境变量未设置）
 * @returns {string} 环境变量的值
 */
function getEnv(name, defaultValue = '') {
  return process.env[name] || defaultValue;
}

/**
 * 简单的HTTP GET请求
 * @param {string} url - 请求的URL
 * @returns {Promise<string>} 响应内容
 */
function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/**
 * 生成随机字符串
 * @param {number} length - 字符串长度
 * @returns {string} 生成的随机字符串
 */
function generateRandomString(length) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

/**
 * 简单的文本加密
 * @param {string} text - 要加密的文本
 * @param {string} secretKey - 加密密钥
 * @returns {string} 加密后的字符串
 */
function encryptText(text, secretKey) {
  const cipher = crypto.createCipher('aes-192-cbc', secretKey);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/**
 * 简单的文本解密
 * @param {string} encryptedText - 要解密的文本
 * @param {string} secretKey - 解密密钥
 * @returns {string} 解密后的字符串
 */
function decryptText(encryptedText, secretKey) {
  const decipher = crypto.createDecipher('aes-192-cbc', secretKey);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// 使用示例
(async () => {
  // 格式化当前日期
  console.log(`Current Date: ${formatDate()}`);

  // 从环境变量获取值
  const exampleEnv = getEnv('EXAMPLE_ENV', 'defaultValue');
  console.log(`Example Env: ${exampleEnv}`);

  // 发起一个简单的HTTP GET请求
  try {
    const data = await httpGet('https://api.github.com/users/github');
    console.log(`GitHub User Data: ${data.slice(0, 100)}...`);
  } catch (error) {
    console.error(`Error making HTTP GET request: ${error}`);
  }

  // 生成随机字符串
  console.log(`Random String: ${generateRandomString(10)}`);

  // 加密和解密示例
  const secretKey = 'yourSecretKey';
  const originalText = 'Hello, World!';
  const encryptedText = encryptText(originalText, secretKey);
  const decryptedText = decryptText(encryptedText, secretKey);

  console.log(`Original Text: ${originalText}`);
  console.log(`Encrypted Text: ${encryptedText}`);
  console.log(`Decrypted Text: ${decryptedText}`);
})();
