# Angular SPA POC for SQL Query Directive
1. All APIs have been accessed and built with services. The only one linked into Query filter is Block Data.
2. When testing you can add as many conditions as you like at the root level.
3. Creating groups and subgroups works in the app but there is a minor data structure problem when posting the filter in the query. Needs more work with backend
4. Sort by is hard coded to size and results are hard coded to 20.
5. Projections are ['hash','height','size','totalFees', 'medianFee', 'numTransactions'] to save space and query time.
