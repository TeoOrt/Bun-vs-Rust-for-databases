class Fetcher {
  static subjects = [
    "biology",
    "chemistry",
    "mathematics",
    "physics",
    "programming",
    "management",
    "entrepreneurship",
    "history",
    "women",
    "education",
    "painting",
    "music",
    "dance",
    "fashion",
    "thriller",
    "plays",
    "poetry",
  ];

  static path = "test.json";
  book_list = new Array();

  async fetch_books(this: Fetcher, obj: string) {
    try {
      const res = await fetch(`https://openlibrary.org/subjects/${obj}.json`);
      const result = await res.json();
      if (!Array.isArray(result.works)) {
        return;
      }
      return result.works.map((val: any) => {
        return {
          key: val["key"],
          title: val["title"],
          cover_id: val["cover_id"] == null ? 0 : val["cover_id"],
          subject: val["subject"],
          authors: val["authors"],
        };
      });
    } catch (e) {
      console.log("this shit is stupid", e);
    }
  }
  async map_data() {
    const data = await Promise.all(Fetcher.subjects.map(this.fetch_books));
    const book_list: any[] = [];
    data.forEach((outer) => {
      outer.forEach((val: any) => {
        book_list.push({
          key: val["key"],
          title: val["title"],
          cover_id: val["cover_id"] == null ? 0 : val["cover_id"],
          subject: val["subject"],
          authors: val["authors"],
        });
      });
    });

    this.book_list = book_list;
  }
  async write_to_file() {
    try {
      Bun.write(Fetcher.path, JSON.stringify(this.book_list));
    } catch (e) {
      console.log("not her", e);
    }
  }
}

export default Fetcher;
