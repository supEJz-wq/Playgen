import { queryTemplates } from '../constants/queryLibrary';

export function getQueryTemplateById(id) {
  return queryTemplates.find((t) => t.id === id) || null;
}

function pick(source, key, fallback) {
  return key in source ? source[key] : fallback;
}

export function applyQueryTemplate(template, currentForm) {
  if (!template) return null;
  const tf = template.form;
  return {
    ...currentForm,
    databaseType: pick(tf, 'databaseType', currentForm.databaseType || 'PostgreSQL'),
    tableName: pick(tf, 'tableName', currentForm.tableName || ''),
    validationType: pick(tf, 'validationType', currentForm.validationType || ''),
    conditions: tf.conditions ? tf.conditions.map((c) => ({ ...c })) : (currentForm.conditions || []),
    joinEnabled: pick(tf, 'joinEnabled', false),
    joinType: pick(tf, 'joinType', 'INNER JOIN'),
    joinTable: pick(tf, 'joinTable', ''),
    joinPrimaryColumn: pick(tf, 'joinPrimaryColumn', ''),
    joinForeignColumn: pick(tf, 'joinForeignColumn', ''),
    aggregateEnabled: pick(tf, 'aggregateEnabled', false),
    aggregateFunction: pick(tf, 'aggregateFunction', 'COUNT'),
    aggregateColumn: pick(tf, 'aggregateColumn', ''),
    limit: tf.limit !== undefined ? tf.limit : (tf.limitValue !== undefined ? tf.limitValue : currentForm.limit || ''),
    orderByColumn: pick(tf, 'orderByColumn', tf.orderColumn || currentForm.orderByColumn || ''),
    orderByDirection: pick(tf, 'orderByDirection', tf.orderDirection || currentForm.orderByDirection || 'ASC'),
  };
}
