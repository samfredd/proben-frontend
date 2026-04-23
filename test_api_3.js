const val = "2026-04-25T07:24:14.020Z";
console.log(new Date(val).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }));
