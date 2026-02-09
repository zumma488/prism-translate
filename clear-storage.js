// 清除 localStorage 中的所有翻译应用数据
// 在浏览器控制台中运行此脚本

console.log('🧹 开始清除 Prism Translate 数据...');

// 清除主配置
const settingsKey = 'ai-translator-settings-v2';
if (localStorage.getItem(settingsKey)) {
    localStorage.removeItem(settingsKey);
    console.log('✅ 已清除配置数据:', settingsKey);
} else {
    console.log('ℹ️  未找到配置数据');
}

// 清除旧版本配置(如果存在)
const oldSettingsKey = 'ai-translator-settings';
if (localStorage.getItem(oldSettingsKey)) {
    localStorage.removeItem(oldSettingsKey);
    console.log('✅ 已清除旧版配置:', oldSettingsKey);
}

// 清除翻译历史(如果存在)
const historyKey = 'translation-history-v1';
if (localStorage.getItem(historyKey)) {
    localStorage.removeItem(historyKey);
    console.log('✅ 已清除翻译历史:', historyKey);
}

// 清除用户偏好(如果存在)
const preferencesKey = 'user-preferences';
if (localStorage.getItem(preferencesKey)) {
    localStorage.removeItem(preferencesKey);
    console.log('✅ 已清除用户偏好:', preferencesKey);
}

// 清除备份数据(如果存在)
let backupCount = 0;
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('backup-')) {
        localStorage.removeItem(key);
        backupCount++;
    }
}
if (backupCount > 0) {
    console.log(`✅ 已清除 ${backupCount} 个备份文件`);
}

console.log('✨ 清除完成! 请刷新页面开始全新配置。');
console.log('💡 提示: 按 Ctrl+Shift+R (Windows) 或 Cmd+Shift+R (Mac) 强制刷新');
