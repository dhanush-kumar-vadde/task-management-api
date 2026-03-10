const buildQuery = (reqQuery) => {

  const page = parseInt(reqQuery.page) || 1;
  const limit = parseInt(reqQuery.limit) || 10;

  const skip = (page - 1) * limit;

  const sortBy = reqQuery.sortBy || "createdAt";
  const order = reqQuery.order === "asc" ? 1 : -1;

  const sort = {};
  sort[sortBy] = order;

  const filters = { ...reqQuery };

  const excluded = ["page", "limit", "sortBy", "order"];

  excluded.forEach((field) => delete filters[field]);

  return {
    page,
    limit,
    skip,
    sort,
    filters
  };
};

module.exports = buildQuery;