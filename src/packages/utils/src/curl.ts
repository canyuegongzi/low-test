interface CurlRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  query: Record<string, string>;
  body: Record<string, string>;
}

function parseDataRaw(curlLine: string): Record<string, any> | null {
  const regex = /--data-raw\s+([^ ]+)/; // 匹配 --data-raw 后的 JSON 内容
  const match = curlLine.match(regex);

  if (match && match[1]) {
    const jsonString = match[1].trim();
    try {
      // 解析 JSON 字符串
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("无法解析 JSON:", error);
      return null; // 如果解析失败，则返回 null
    }
  }

  return null; // 如果没有匹配到，返回 null
}

function parseCurl(curl: string): CurlRequest {
  const lines = curl.split('\n').map(line => line.trim());
  let url = '';
  let method = 'GET'; // 默认方法
  const headers: Record<string, string> = {};
  const query: Record<string, string> = {};
  let body: any;

  for (const line of lines) {
    // 提取方法和URL
    if (line.startsWith("curl")) {
      const parts = line.split(' ').slice(1);
      for (const part of parts) {
        if (part.startsWith('-X')) {
          method = parts[parts.indexOf(part) + 1] || method; // 获取方法
        } else if (part.startsWith('http') || part.startsWith("'http")) {
          url = part; // 获取URL
        }
      }
    }

    // 提取 Headers
    if (line.startsWith('-H')) {
      const headerPair = line.slice(3).split(':');
      if (headerPair.length === 2) {
        headers[headerPair[0].trim().replace(/'/g, '')] = headerPair[1].trim().replace(/'/g, '');
      }
    }

    // 提取 Body
    if (line.startsWith('--data-raw') || line.startsWith('--data')) {
      // body = line.slice(line.indexOf('{')).trim();

      body = line.trim().replace(/'/g, '')
      body = parseDataRaw(body);
      // body = JSON.parse(body)
    }
  }

  url = url.replace(/^['"]|['"]$/g, '').trim();

  // 解析 URL 中的查询参数
  const urlObj = new URL(url);
  url = urlObj.origin + urlObj.pathname; // 更新 URL 去掉查询参数
  urlObj.searchParams.forEach((value, key) => {
    query[key] = value;
  });

  return {
    url,
    method,
    headers,
    query,
    body,
  };
}

export {
  parseCurl
}
