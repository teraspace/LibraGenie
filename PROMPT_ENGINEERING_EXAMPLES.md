# Prompt Engineering Examples and AI Code Evaluation
## Detailed Examples from LibraGenie Development

### 1. Complete Prompt Engineering Session

#### Initial System Architecture Prompt

**Exact Prompt Used:**
```
I need to create a Ruby on Rails library management system for a technical interview. Here are the specific requirements:

BACKEND REQUIREMENTS:
- Authentication: Users can register/login/logout with two roles (Librarian, Member)
- Book Management: CRUD operations for books with title, author, genre, ISBN, total copies
- Only Librarians can add/edit/delete books
- Search functionality by title, author, or genre
- Borrowing system: Members can borrow available books (2-week loan period)
- No duplicate borrowing of same book
- Track borrowing/due dates, librarian can mark as returned
- Dashboard with different views for Librarian vs Member
- RESTful API with proper status codes
- Complete RSpec testing suite

FRONTEND REQUIREMENTS:
- Integrate with React for modern frontend
- Responsive and user-friendly interface
- CRUD operations through frontend
- Clean component structure

TECHNICAL SPECS:
- Rails 8.0.2, PostgreSQL, Devise for auth
- React 19.1.0 with modern hooks
- Tailwind CSS for styling
- ESBuild for asset compilation

Please generate:
1. Complete model structure with associations and validations
2. Controllers with proper authorization
3. Database migrations
4. Basic React components
5. Routes configuration
6. Seeds file for demo data

Focus on Rails best practices, security, and performance.
```

**AI Response Analysis:**
- **Quality Score: 7/10**
- **Strengths:** Generated complete MVC structure, proper associations
- **Weaknesses:** Missing advanced validations, security gaps, React 19 incompatibility

#### Model Refinement Prompt

**Follow-up Prompt:**
```
The Book model you generated needs improvement. Please enhance it with:

1. Advanced ISBN validation (ISBN-10 and ISBN-13 formats)
2. Proper length constraints for database optimization
3. Business logic methods for availability checking
4. Scopes for efficient querying
5. Custom display methods for better UX
6. Add indexes for performance

Current model:
[inserted AI-generated basic model]

Make it production-ready with all edge cases handled.
```

**Improved AI Output:**
```ruby
class Book < ApplicationRecord
  belongs_to :author
  belongs_to :category
  has_many :loans, dependent: :destroy

  validates :title, presence: true, length: { maximum: 255 }
  validates :isbn, presence: true, uniqueness: true,
            format: { with: /\A(?:\d{9}[\dX]|\d{13})\z/,
                     message: "must be a valid ISBN-10 or ISBN-13" }
  validates :total_copies, presence: true, numericality: { greater_than: 0 }
  validates :available, inclusion: { in: [true, false] }

  scope :available, -> { where(available: true) }
  scope :borrowed, -> { where(available: false) }
  scope :by_author, ->(author) { joins(:author).where(authors: { name: author }) }

  def borrowed?
    !available?
  end

  def display_title
    "#{title} - #{author.name} (#{category.name})"
  end

  def can_be_borrowed_by?(user)
    available? && !user.has_borrowed?(self)
  end
end
```

**Critical Evaluation:**
- ✅ **Improved:** Added comprehensive validations
- ✅ **Enhanced:** Business logic methods
- ✅ **Performance:** Added scopes for optimization
- ⚠️ **Missing:** Still needed database indexes (added manually)

### 2. React Component Debugging Session

#### Problem Discovery Prompt

**Debugging Prompt:**
```
I'm getting this error in my Rails 8 + React 19 application:

Error: createRoot is not a function
at initializeDashboard (application.js:1234)

My current code:
```javascript
import ReactDOM from 'react-dom';
const root = ReactDOM.createRoot(container);
```

This is a Rails app with ESBuild compilation. React 19 is installed. The component works in development but fails in production. What's the issue and how do I fix it?
```

**AI Diagnosis:**
```
The issue is with React 19 import changes. In React 19, createRoot is imported differently:

// Wrong (React 18 pattern)
import ReactDOM from 'react-dom';
ReactDOM.createRoot(container);

// Correct (React 19 pattern)
import { createRoot } from 'react-dom/client';
createRoot(container);
```

**Human Critical Analysis:**
- ✅ **Correct diagnosis** of import issue
- ❌ **Incomplete solution** - didn't account for Rails asset pipeline complexity
- ❌ **Missing** fallback mechanisms for different environments

#### Enhanced Solution Development

**Follow-up Prompt:**
```
The import fix works in development but fails in Rails production with asset compilation. The global window.ReactDOM is available but window.createRoot is not. I need a robust solution that works across:

1. Development environment
2. Production with compiled assets
3. Different React loading scenarios
4. Graceful fallbacks if React fails to load

Create a production-ready initialization function.
```

**Final AI-Assisted Solution:**
```javascript
// Robust React 19 compatibility layer
function initializeDashboard() {
  const container = document.getElementById('dashboard-react');
  if (!container) {
    console.error('Dashboard container not found');
    return;
  }

  // Clear any existing content
  container.innerHTML = '';

  if (!window.React || !window.Dashboard) {
    container.innerHTML = '<div class="p-4 bg-yellow-100 border border-yellow-400 rounded">React Dashboard component failed to load. Please refresh the page.</div>';
    return;
  }

  try {
    const element = React.createElement(Dashboard, {
      initialData: data
    });

    // Try different rendering methods based on what's available
    if (window.createRoot) {
      const root = window.createRoot(container);
      root.render(element);
    } else if (window.ReactDOM?.createRoot) {
      const root = window.ReactDOM.createRoot(container);
      root.render(element);
    } else if (window.ReactDOM?.render) {
      window.ReactDOM.render(element, container);
    } else {
      container.innerHTML = '<div class="p-4 bg-blue-100 border border-blue-400 rounded">Dashboard component loaded (fallback mode)</div>';
    }
  } catch (error) {
    console.error('Dashboard rendering failed:', error);
    container.innerHTML = '<div class="p-4 bg-red-100 border border-red-400 rounded">Error: ' + error.message + '</div>';
  }
}
```

**Human Validation Process:**
1. ✅ **Tested** in development environment
2. ✅ **Verified** production asset compilation
3. ✅ **Confirmed** graceful fallbacks work
4. ✅ **Added** comprehensive error handling

### 3. Security Validation Example

#### Security Review Prompt

**Security Analysis Prompt:**
```
Review this AI-generated Rails controller for security vulnerabilities:

```ruby
class BooksController < ApplicationController
  def index
    @books = Book.all
  end

  def create
    @book = Book.create(params[:book])
    redirect_to @book
  end

  def update
    @book = Book.find(params[:id])
    @book.update(params[:book])
    redirect_to @book
  end
end
```

Identify all security issues and provide a secure version following Rails best practices.
```

**AI Security Analysis:**
```
Security Issues Identified:
1. Mass assignment vulnerability - no strong parameters
2. Missing authorization checks
3. No CSRF protection verification
4. No input validation
5. Missing error handling
6. Potential SQL injection through direct params usage
7. No access control between user roles

Secure Version:
[AI provided improved controller with basic fixes]
```

**Human Security Enhancement:**
```ruby
class BooksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_book, only: [:show, :edit, :update, :destroy]
  before_action :authorize_librarian, only: [:new, :create, :edit, :update, :destroy]

  def index
    @books = Book.includes(:author, :category)
                 .page(params[:page])
                 .per(20)

    if params[:search].present?
      @books = @books.search(params[:search])
    end

    respond_to do |format|
      format.html
      format.json { render json: @books }
    end
  end

  def create
    @book = Book.new(book_params)
    authorize @book

    respond_to do |format|
      if @book.save
        format.html { redirect_to @book, notice: 'Book was successfully created.' }
        format.json { render :show, status: :created, location: @book }
      else
        format.html { render :new }
        format.json { render json: @book.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def set_book
    @book = Book.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    redirect_to books_path, alert: 'Book not found.'
  end

  def book_params
    params.require(:book).permit(:title, :isbn, :author_id, :category_id, :total_copies, :description)
  end

  def authorize_librarian
    redirect_to root_path, alert: 'Access denied.' unless current_user.librarian?
  end
end
```

**Security Improvements Added:**
- ✅ **Strong parameters** with explicit whitelisting
- ✅ **Authorization checks** with Pundit integration
- ✅ **Role-based access control**
- ✅ **Error handling** for edge cases
- ✅ **Performance optimization** with includes
- ✅ **Input sanitization** and validation

### 4. Performance Optimization Session

#### Performance Analysis Prompt

**Performance Review Prompt:**
```
Analyze this AI-generated dashboard method for performance issues:

```ruby
def dashboard_data
  data = {}

  data[:total_books] = Book.count
  data[:available_books] = Book.where(available: true).count
  data[:borrowed_books] = Book.where(available: false).count
  data[:total_users] = User.count
  data[:active_loans] = Loan.where(returned_at: nil).count

  if current_user.librarian?
    data[:overdue_loans] = Loan.where('due_date < ? AND returned_at IS NULL', Date.current).count
    data[:due_today] = Loan.where(due_date: Date.current, returned_at: nil).count
  end

  render json: data
end
```

Identify performance bottlenecks and provide an optimized version.
```

**AI Performance Analysis:**
```
Performance Issues:
1. Multiple individual database queries (N+1 style)
2. No caching mechanism
3. Inefficient date queries
4. No pagination for large datasets
5. No database indexes utilized

Suggested Optimizations:
- Combine queries where possible
- Add caching
- Use more efficient date queries
- Add database indexes
```

**Human Performance Enhancement:**
```ruby
def dashboard_data
  # Cache the expensive dashboard calculations
  cache_key = "dashboard_data_#{current_user.id}_#{current_user.role}"

  @data = Rails.cache.fetch(cache_key, expires_in: 5.minutes) do
    # Use single queries with optimized database access
    base_stats = Book.connection.select_one(<<-SQL)
      SELECT
        COUNT(*) as total_books,
        COUNT(CASE WHEN available = true THEN 1 END) as available_books,
        COUNT(CASE WHEN available = false THEN 1 END) as borrowed_books
      FROM books
    SQL

    user_count = User.count
    active_loans_count = Loan.active.count

    stats = {
      totalBooks: base_stats['total_books'].to_i,
      availableBooks: base_stats['available_books'].to_i,
      borrowedBooks: base_stats['borrowed_books'].to_i,
      totalUsers: user_count,
      totalLoans: active_loans_count
    }

    # Role-specific data with optimized queries
    if current_user.librarian?
      overdue_data = Loan.connection.select_one(<<-SQL)
        SELECT
          COUNT(CASE WHEN due_date < CURRENT_DATE THEN 1 END) as overdue_count,
          COUNT(CASE WHEN due_date = CURRENT_DATE THEN 1 END) as due_today_count
        FROM loans
        WHERE returned_at IS NULL
      SQL

      stats.merge!(
        overdueLoans: overdue_data['overdue_count'].to_i,
        dueToday: overdue_data['due_today_count'].to_i
      )
    else
      # Member-specific optimized query
      user_loan_stats = current_user.loans.active
                                   .select("COUNT(*) as borrowed_count,
                                           COUNT(CASE WHEN due_date < CURRENT_DATE THEN 1 END) as overdue_count")
                                   .first

      stats.merge!(
        userBorrowedBooks: user_loan_stats.borrowed_count.to_i,
        userOverdueBooks: user_loan_stats.overdue_count.to_i
      )
    end

    { stats: stats, timestamp: Time.current }
  end

  respond_to do |format|
    format.json { render json: @data }
    format.html { @stats = @data[:stats] }
  end
end
```

**Performance Improvements:**
- ✅ **Reduced queries** from 5+ to 2-3 optimized queries
- ✅ **Added caching** with role-based cache keys
- ✅ **SQL optimization** with aggregate functions
- ✅ **Database efficiency** using single complex queries instead of multiple simple ones
- ✅ **Scalable design** that performs well with large datasets

### 5. Testing Strategy with AI

#### Test Generation Prompt

**Testing Prompt:**
```
Generate comprehensive RSpec tests for this Book model:

```ruby
class Book < ApplicationRecord
  belongs_to :author
  belongs_to :category
  has_many :loans, dependent: :destroy

  validates :title, presence: true, length: { maximum: 255 }
  validates :isbn, presence: true, uniqueness: true,
            format: { with: /\A(?:\d{9}[\dX]|\d{13})\z/ }
  validates :total_copies, presence: true, numericality: { greater_than: 0 }
  validates :available, inclusion: { in: [true, false] }

  scope :available, -> { where(available: true) }
  scope :borrowed, -> { where(available: false) }

  def borrowed?
    !available?
  end

  def display_title
    "#{title} - #{author.name} (#{category.name})"
  end
end
```

Include tests for validations, associations, scopes, and methods. Use FactoryBot factories.
```

**AI Generated Tests (Enhanced by Human):**
```ruby
require 'rails_helper'

RSpec.describe Book, type: :model do
  let(:author) { create(:author) }
  let(:category) { create(:category) }
  let(:book) { build(:book, author: author, category: category) }

  describe 'associations' do
    it { should belong_to(:author) }
    it { should belong_to(:category) }
    it { should have_many(:loans).dependent(:destroy) }
  end

  describe 'validations' do
    context 'title validation' do
      it { should validate_presence_of(:title) }
      it { should validate_length_of(:title).is_at_most(255) }
    end

    context 'ISBN validation' do
      it { should validate_presence_of(:isbn) }
      it { should validate_uniqueness_of(:isbn) }

      it 'accepts valid ISBN-10' do
        book.isbn = '0123456789'
        expect(book).to be_valid
      end

      it 'accepts valid ISBN-13' do
        book.isbn = '9780123456789'
        expect(book).to be_valid
      end

      it 'rejects invalid ISBN formats' do
        ['123', 'abc1234567', '978012345678x'].each do |invalid_isbn|
          book.isbn = invalid_isbn
          expect(book).not_to be_valid
          expect(book.errors[:isbn]).to include('must be a valid ISBN-10 or ISBN-13')
        end
      end
    end

    context 'total_copies validation' do
      it { should validate_presence_of(:total_copies) }
      it { should validate_numericality_of(:total_copies).is_greater_than(0) }
    end

    it { should validate_inclusion_of(:available).in_array([true, false]) }
  end

  describe 'scopes' do
    let!(:available_book) { create(:book, available: true) }
    let!(:borrowed_book) { create(:book, available: false) }

    describe '.available' do
      it 'returns only available books' do
        expect(Book.available).to include(available_book)
        expect(Book.available).not_to include(borrowed_book)
      end
    end

    describe '.borrowed' do
      it 'returns only borrowed books' do
        expect(Book.borrowed).to include(borrowed_book)
        expect(Book.borrowed).not_to include(available_book)
      end
    end
  end

  describe '#borrowed?' do
    it 'returns true when book is not available' do
      book.available = false
      expect(book.borrowed?).to be true
    end

    it 'returns false when book is available' do
      book.available = true
      expect(book.borrowed?).to be false
    end
  end

  describe '#display_title' do
    it 'returns formatted title with author and category' do
      book.title = 'Test Book'
      book.author.name = 'Test Author'
      book.category.name = 'Fiction'

      expect(book.display_title).to eq('Test Book - Test Author (Fiction)')
    end
  end
end
```

**Testing Validation Process:**
- ✅ **Comprehensive coverage** of all validations and methods
- ✅ **Edge case testing** for ISBN validation
- ✅ **Association testing** with proper factories
- ✅ **Scope testing** with real data scenarios
- ✅ **Business logic validation** for custom methods

---

## Summary: AI Code Evaluation Framework

### Critical Analysis Checklist

**1. Functional Correctness**
- ✅ Does the code solve the stated problem?
- ✅ Are all requirements addressed?
- ✅ Do edge cases work correctly?

**2. Security Assessment**
- ✅ Strong parameters implemented?
- ✅ Authorization checks in place?
- ✅ Input validation and sanitization?
- ✅ SQL injection prevention?

**3. Performance Evaluation**
- ✅ Database queries optimized?
- ✅ N+1 query problems addressed?
- ✅ Caching implemented where appropriate?
- ✅ Scalability considerations?

**4. Code Quality Review**
- ✅ Follows framework conventions?
- ✅ Readable and maintainable?
- ✅ Proper error handling?
- ✅ Comprehensive test coverage?

**5. Production Readiness**
- ✅ Environment compatibility?
- ✅ Deployment considerations?
- ✅ Monitoring and logging?
- ✅ Documentation completeness?

This framework ensures that AI-generated code meets production standards while leveraging the efficiency of GenAI tools for rapid development.
