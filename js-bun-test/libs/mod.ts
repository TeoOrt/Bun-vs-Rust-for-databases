const mod_file = async () => {
  const read = Bun.file("test.json");

  const cout: any[] = [];

  const data: any[] = await read.json();
  data.forEach((outer_list: any[]) => {
    outer_list.forEach((inner: any[]) => {
      cout.push(inner);
    });
  });
  Bun.write("data.json", JSON.stringify(cout));
};
