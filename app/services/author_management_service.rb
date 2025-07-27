class AuthorManagementService
  attr_reader :author, :params

  def initialize(author = nil, params = {})
    @author = author
    @params = params
  end

  def create
    @author = Author.new(author_params)

    if author.save
      BookManagementService::Result.success(author)
    else
      BookManagementService::Result.failure(author.errors)
    end
  end

  def update
    if author.update(author_params)
      BookManagementService::Result.success(author)
    else
      BookManagementService::Result.failure(author.errors)
    end
  end

  def destroy
    if can_destroy?
      if author.destroy
        BookManagementService::Result.success(message: "Author deleted successfully")
      else
        BookManagementService::Result.failure(author.errors)
      end
    else
      BookManagementService::Result.failure(message: "Cannot delete author with associated books")
    end
  end

  private

  def author_params
    params.require(:author).permit(:name, :bio)
  end

  def can_destroy?
    author.books.count == 0
  end
end
