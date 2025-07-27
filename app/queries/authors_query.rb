class AuthorsQuery
  attr_reader :relation, :params

  def initialize(relation = Author.all, params = {})
    @relation = relation
    @params = params
  end

  def call
    authors = relation.includes(:books)
    authors = apply_search(authors)
    authors = apply_pagination(authors)
    authors
  end

  private

  def apply_search(authors)
    return authors unless params[:search].present?

    authors.where("name ILIKE ?", "%#{params[:search]}%")
  end

  def apply_pagination(authors)
    return authors unless defined?(Kaminari)

    authors.page(params[:page])
  end
end
