class HomeController < ApplicationController
  def index
    @recent_books = Book.includes(:author, :category).limit(6).order(created_at: :desc)
    @total_books = Book.count
    @available_books = Book.available.count
    @borrowed_books = Book.borrowed.count

    if user_signed_in?
      @user_loans = current_user.active_loans.includes(:book)
      @overdue_loans = current_user.overdue_loans.includes(:book)
    end
  end

  def dashboard
    render json: DashboardService.new(current_user).call
  end

  def dashboard_react
    respond_to do |format|
      format.html { render :dashboard_react }
      format.json { render json: DashboardService.new(current_user).call }
    end
  end

  def dashboard_data
    respond_to do |format|
      format.json { render json: DashboardService.new(current_user).call }
    end
  end
end
