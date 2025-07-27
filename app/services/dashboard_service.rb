class DashboardService
  attr_reader :current_user

  def initialize(current_user = nil)
    @current_user = current_user
  end

  def call
    {
      stats: build_stats,
      recent_books: BookSerializer.dashboard_recent(Book.includes(:author, :category)),
      user_loans: user_loans_data,
      recent_loans: system_loans_data
    }
  end

  private

  def build_stats
    base_stats.merge(user_specific_stats).merge(role_specific_stats)
  end

  def base_stats
    {
      totalBooks: Book.count,
      availableBooks: Book.available.count,
      borrowedBooks: Book.borrowed.count
    }
  end

  def user_specific_stats
    return { userLoans: 0, overdueLoans: 0 } unless current_user

    {
      userLoans: current_user.active_loans.count,
      overdueLoans: current_user.overdue_loans.count
    }
  end

  def role_specific_stats
    return {} unless current_user&.can_view_all_loans?

    {
      totalUsers: User.count,
      totalLoans: Loan.count,
      activeLoans: Loan.active.count,
      overdueLoansSystem: Loan.overdue.count,
      totalAuthors: Author.count,
      totalCategories: Category.count
    }
  end

  def user_loans_data
    return [] unless current_user

    loans = current_user.active_loans.includes(book: [:author, :category])
    loans_json = loans.as_json(include: { book: { include: [:author, :category] } })

    # Add overdue flag
    loans_json.each do |loan|
      loan['overdue'] = Date.parse(loan['due_date']) < Date.current
    end

    loans_json
  end

  def system_loans_data
    return [] unless current_user&.can_view_all_loans?

    Loan.includes(user: [], book: [:author, :category])
        .order(created_at: :desc)
        .limit(5)
        .as_json(include: {
          user: { only: [:id, :email] },
          book: { include: [:author, :category] }
        })
  end
end
