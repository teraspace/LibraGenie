class BooksQuery
  attr_reader :relation, :params

  def initialize(relation = Book.all, params = {})
    @relation = relation.includes(:author, :category)
    @params = params
  end

  def call
    search_by_text
    filter_by_category
    filter_by_author
    filter_by_availability
    paginate
    relation
  end

  private

  def search_by_text
    return unless params[:search].present?

    search_term = "%#{params[:search]}%"
    @relation = relation.where(
      "title ILIKE ? OR isbn ILIKE ? OR description ILIKE ?",
      search_term, search_term, search_term
    )
  end

  def filter_by_category
    return unless params[:category_id].present?

    @relation = relation.where(category_id: params[:category_id])
  end

  def filter_by_author
    return unless params[:author_id].present?

    @relation = relation.where(author_id: params[:author_id])
  end

  def filter_by_availability
    return unless params[:available].present?

    @relation = params[:available] == 'true' ? relation.available : relation.borrowed
  end

  def paginate
    return unless defined?(Kaminari) && params[:page].present?

    @relation = relation.page(params[:page])
  end
end
