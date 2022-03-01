
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

module.exports = async () => {
  let handle : any;
  try {
    const historyPath = path.join(os.homedir(), '.cpprepl_history');
    handle = await fs.open(historyPath, 'a+', 0o0600);
    const data = await handle.readFile({ encoding: 'utf8' });
    const history = data.split(os.EOL, 1000);
    const writeHistory = async (d:any) => {
      if (!handle) {
        return false;
      }
      try {
        await handle.truncate(0);
        await handle.writeFile(d.join(os.EOL));
        return true;
      } catch {
        handle.close().catch(() => undefined);
        handle = null;
        return false;
      }
    };
    return { history, writeHistory };
  } catch {
    if (handle) {
      handle.close().catch(() => undefined);
    }
    return { history: [], writeHistory: () => false };
  }
};
