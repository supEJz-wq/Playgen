export function toPipelineModel(pipelineInfo) {
  return {
    pipeline: {
      automationFramework: pipelineInfo.automationFramework,
      language: pipelineInfo.language,
      ciPlatform: pipelineInfo.ciPlatform,
      pipelineName: pipelineInfo.pipelineName,
      operatingSystem: pipelineInfo.operatingSystem,
      trigger: pipelineInfo.trigger,
      executionMode: pipelineInfo.executionMode,
      enableRetry: pipelineInfo.enableRetry || false,
      browser: pipelineInfo.browser,
      platform: pipelineInfo.platform,
      buildTool: pipelineInfo.buildTool || 'npm',
      parallelExecution: pipelineInfo.parallelExecution || false,
      reports: pipelineInfo.reports || { html: true, allure: false, junit: false },
      artifacts: pipelineInfo.artifacts || { reports: true, screenshots: false, videos: false, logs: false },
      testSuites: pipelineInfo.testSuites || [],
      executionOptions: pipelineInfo.executionOptions || { mode: 'sequential', workers: 2, retries: 0, timeout: 60, slowMo: 0, failFast: false, headless: true },
      environments: pipelineInfo.environments || [],
      activeEnvironment: pipelineInfo.activeEnvironment || 'dev',
      cacheConfig: pipelineInfo.cacheConfig || { packageManager: 'npm' },
      matrixConfig: pipelineInfo.matrixConfig || { browsers: ['chromium'], os: ['ubuntu-latest'] },
      projectVariables: pipelineInfo.projectVariables || [],
    },
  }
}
