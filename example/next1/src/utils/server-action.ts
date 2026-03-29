"use server";

import { range, filter, map } from "rxjs";

export async function serverFunc() {
  console.log(typeof window);
  range(1, 1)
    .pipe(
      filter((x) => x % 2 === 1),
      map((x) => x + x),
    )
    .subscribe((x) => console.log(x));
}
