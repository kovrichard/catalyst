type FieldKind = "string" | "boolean" | "number" | "datetime";

type FieldSpec = {
  kind: FieldKind;
  filterable?: boolean;
  sortable?: boolean;
};

type ScopeKind = "self" | "user-owned";

export type ModelSpec = {
  table: string;
  description: string;
  scope: { kind: ScopeKind; column: string };
  fields: Record<string, FieldSpec>;
};

/**
 * The MCP read surface. A model is invisible unless it appears here, and a
 * column is invisible unless it appears in that model's `fields`. Auth tables
 * (sessions, accounts, verifications, apikey) are deliberately absent, as is
 * `User.password` — omission is the access control, not a filter applied later.
 */
const mcpRegistry = {
  user: {
    table: "users",
    description: "The authenticated user's own account record.",
    scope: { kind: "self", column: "id" },
    fields: {
      id: { kind: "string" },
      name: { kind: "string", filterable: true },
      email: { kind: "string", filterable: true },
      emailVerified: { kind: "boolean", filterable: true },
      image: { kind: "string" },
      createdAt: { kind: "datetime", filterable: true, sortable: true },
    },
  },
  notification: {
    table: "notifications",
    description: "In-app notifications belonging to the authenticated user.",
    scope: { kind: "user-owned", column: "userId" },
    fields: {
      id: { kind: "string" },
      type: { kind: "string", filterable: true },
      title: { kind: "string", filterable: true },
      content: { kind: "string", filterable: true },
      link: { kind: "string" },
      read: { kind: "boolean", filterable: true },
      archived: { kind: "boolean", filterable: true },
      createdAt: { kind: "datetime", filterable: true, sortable: true },
    },
  },
} as const satisfies Record<string, ModelSpec>;

export type ExposedModel = keyof typeof mcpRegistry;

const specs: Record<ExposedModel, ModelSpec> = mcpRegistry;

const scopeNotes: Record<ScopeKind, string> = {
  self: "Only your own record is ever returned.",
  "user-owned": "Only rows you own are ever returned.",
};

const modelsByTable = new Map<string, ExposedModel>(
  (Object.keys(specs) as ExposedModel[]).map((model) => [specs[model].table, model])
);

export function modelSpec(model: ExposedModel): ModelSpec {
  return specs[model];
}

export function exposedModels(): ExposedModel[] {
  return Object.keys(specs) as ExposedModel[];
}

export function exposedTables(): string[] {
  return [...modelsByTable.keys()];
}

export function tableName(model: ExposedModel): string {
  return specs[model].table;
}

export function modelForTable(table: string): ExposedModel | undefined {
  return modelsByTable.get(table);
}

export function filterableFields(model: ExposedModel): string[] {
  const { fields } = modelSpec(model);
  return Object.keys(fields).filter((field) => fields[field]?.filterable === true);
}

export function sortableFields(model: ExposedModel): string[] {
  const { fields } = modelSpec(model);
  return Object.keys(fields).filter((field) => fields[field]?.sortable === true);
}

export function listTables() {
  return exposedModels().map((model) => {
    const spec = modelSpec(model);
    return {
      table: spec.table,
      description: spec.description,
      access: scopeNotes[spec.scope.kind],
    };
  });
}

export function describeTable(model: ExposedModel) {
  const spec = modelSpec(model);

  return {
    table: spec.table,
    description: spec.description,
    access: scopeNotes[spec.scope.kind],
    fields: Object.entries(spec.fields).map(([name, field]) => ({
      name,
      kind: field.kind,
      filterable: field.filterable === true,
      sortable: field.sortable === true,
    })),
  };
}
