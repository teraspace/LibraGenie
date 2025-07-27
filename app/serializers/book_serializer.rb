class BookSerializer
  def self.collection(books, options = {})
    {
      books: books.as_json(include: [:author, :category]),
      authors: options[:authors] || Author.all,
      categories: options[:categories] || Category.all,
      meta: {
        total: books.respond_to?(:total_count) ? books.total_count : books.count,
        current_page: books.respond_to?(:current_page) ? books.current_page : 1,
        per_page: books.respond_to?(:limit_value) ? books.limit_value : books.count
      }
    }
  end

  def self.single(book, options = {})
    book_json = book.as_json(include: [:author, :category])

    if options[:include_loan_info] && book.current_loan
      book_json[:current_loan] = book.current_loan.as_json(include: [:user])
    end

    book_json
  end

  def self.dashboard_recent(books)
    books.limit(6).order(created_at: :desc).as_json(include: [:author, :category])
  end
end
