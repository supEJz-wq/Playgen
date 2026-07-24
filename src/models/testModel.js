export function createEmptyTest() {
  return {
    project: {
      projectName: '',
      environment: '',
      feature: '',
      module: '',
      baseUrl: '',
      testTitle: '',
      author: '',
      priority: 'Medium',
      tags: [],
      description: '',
    },
    settings: {
      framework: 'playwright',
      language: 'JavaScript',
      architecture: 'simple',
    },
    steps: [],
    assertions: [],
    variables: [],
  }
}

export function toTestModel(projectInfo, settings, steps, assertions, variables) {
  return {
    project: { ...projectInfo },
    settings: { ...settings },
    steps: steps.map((s) => ({
      action: s.action,
      locatorType: s.locatorType || 'CSS',
      locator: s.locator || '',
      value: s.value || '',
      description: s.description || '',
      expectedValue: s.expectedValue || '',
      notes: s.notes || '',
    })),
    assertions: assertions.map((a) => ({
      type: a.type,
      locatorType: a.locatorType || 'CSS',
      locator: a.locator || '',
      value: a.value || '',
    })),
    variables: (variables || []).map((v) => ({
      name: v.name,
      value: v.value,
    })),
  }
}

export function fromTestModel(model) {
  return {
    projectInfo: { ...model.project },
    settings: { ...model.settings },
    steps: [...model.steps],
    assertions: [...model.assertions],
    testData: [...(model.variables || [])],
  }
}
