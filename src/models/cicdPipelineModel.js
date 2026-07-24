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
    },
  }
}
