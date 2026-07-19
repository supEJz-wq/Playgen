import { templates } from '../constants/templates';

export function getTemplateById(id) {
  return templates.find((t) => t.id === id) || null;
}

export function applyTemplate(template) {
  if (!template) return null;
  return {
    projectInfo: { ...template.projectInfo },
    steps: template.steps.map((s) => ({ ...s })),
    assertions: template.assertions.map((a) => ({ ...a })),
    testData: template.testData.map((d) => ({ ...d })),
  };
}
