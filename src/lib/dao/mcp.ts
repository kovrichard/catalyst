import {
  type ExposedModel,
  filterableFields,
  modelSpec,
  sortableFields,
  tableName,
} from "@/lib/mcp/registry";
import prisma from "@/lib/prisma/prisma";

type FilterOperator = "equals" | "not" | "contains" | "gt" | "gte" | "lt" | "lte";

export type QueryFilter = {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean;
};

export type QueryOptions = {
  filters?: QueryFilter[];
  orderBy?: { field: string; direction: "asc" | "desc" };
  limit?: number;
  cursor?: string;
};

export const minLimit = 1;
export const maxLimit = 100;
const defaultLimit = 25;

type PrismaValue = string | number | boolean | Date;
type WhereClause = Record<string, unknown>;

type ReadDelegate = {
  findMany: (args: Record<string, unknown>) => Promise<Record<string, unknown>[]>;
  findFirst: (args: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
  count: (args: Record<string, unknown>) => Promise<number>;
};

const readDelegates: Record<ExposedModel, ReadDelegate> = {
  user: prisma.user as unknown as ReadDelegate,
  notification: prisma.notification as unknown as ReadDelegate,
};

function clampLimit(limit: number | undefined): number {
  if (limit === undefined) return defaultLimit;
  return Math.min(maxLimit, Math.max(minLimit, Math.trunc(limit)));
}

function buildSelect(model: ExposedModel): Record<string, true> {
  const select: Record<string, true> = {};
  for (const field of Object.keys(modelSpec(model).fields)) {
    select[field] = true;
  }
  return select;
}

function coerceValue(
  model: ExposedModel,
  field: string,
  value: string | number | boolean
): PrismaValue {
  if (modelSpec(model).fields[field]?.kind !== "datetime") return value;

  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(
      `Filter on "${field}" needs an ISO date, received "${String(value)}".`
    );
  }
  return parsed;
}

function assertContainsIsStringOnly(model: ExposedModel, filter: QueryFilter): void {
  const isString = modelSpec(model).fields[filter.field]?.kind === "string";
  if (filter.operator === "contains" && !isString) {
    throw new Error(
      `Operator "contains" only applies to string fields, not "${filter.field}".`
    );
  }
}

function compileFilters(model: ExposedModel, filters: QueryFilter[]): WhereClause {
  const allowed = filterableFields(model);
  const where: WhereClause = {};

  for (const filter of filters) {
    if (!allowed.includes(filter.field)) {
      throw new Error(
        `Field "${filter.field}" is not filterable on "${tableName(model)}". Filterable: ${allowed.join(", ")}.`
      );
    }

    assertContainsIsStringOnly(model, filter);
    where[filter.field] = {
      [filter.operator]: coerceValue(model, filter.field, filter.value),
    };
  }

  return where;
}

function compileOrderBy(
  model: ExposedModel,
  orderBy: QueryOptions["orderBy"]
): Record<string, string>[] {
  if (!orderBy) return [{ id: "desc" }];

  const allowed = sortableFields(model);
  if (!allowed.includes(orderBy.field)) {
    throw new Error(
      `Field "${orderBy.field}" is not sortable on "${tableName(model)}". Sortable: ${allowed.join(", ") || "none"}.`
    );
  }

  return [{ [orderBy.field]: orderBy.direction }, { id: "desc" }];
}

function scopedWhere(
  model: ExposedModel,
  userId: string,
  filters: WhereClause
): WhereClause {
  return { ...filters, [modelSpec(model).scope.column]: userId };
}

function ownedRecordWhere(model: ExposedModel, userId: string, id: string): WhereClause {
  return { AND: [{ id }, { [modelSpec(model).scope.column]: userId }] };
}

export async function queryModel(
  model: ExposedModel,
  userId: string,
  options: QueryOptions
) {
  const where = scopedWhere(model, userId, compileFilters(model, options.filters ?? []));
  const take = clampLimit(options.limit);

  const rows = await readDelegates[model].findMany({
    where,
    select: buildSelect(model),
    orderBy: compileOrderBy(model, options.orderBy),
    take: take + 1,
    ...(options.cursor ? { cursor: { id: options.cursor }, skip: 1 } : {}),
  });

  const total = await readDelegates[model].count({ where });
  const hasMore = rows.length > take;
  const page = hasMore ? rows.slice(0, take) : rows;

  return {
    rows: page,
    total,
    limit: take,
    nextCursor: hasMore ? String(page.at(-1)?.id ?? "") : null,
  };
}

export async function getRecord(model: ExposedModel, userId: string, id: string) {
  return readDelegates[model].findFirst({
    where: ownedRecordWhere(model, userId, id),
    select: buildSelect(model),
  });
}
