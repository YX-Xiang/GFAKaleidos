module.exports = {
  apps : [{
    name      : 'spring',
    script    : 'mvn',
    args      : 'spring-boot:run',
    cwd       : './web', // 确保指向包含pom.xml的目录
    watch     : true, // 如果需要 PM2 监听文件变化自动重启应用，设置为 true
    env: {
      SPRING_PROFILES_ACTIVE: 'dev', // 根据需要设置环境变量
      // 其他需要的环境变量可以在这里设置
    }
  }]
};

