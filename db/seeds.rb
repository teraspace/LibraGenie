# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Create categories
fiction = Category.find_or_create_by!(name: "Fiction") do |category|
  category.description = "Fictional narratives and stories"
end

non_fiction = Category.find_or_create_by!(name: "Non-Fiction") do |category|
  category.description = "Factual books and references"
end

science = Category.find_or_create_by!(name: "Science") do |category|
  category.description = "Scientific research and discoveries"
end

technology = Category.find_or_create_by!(name: "Technology") do |category|
  category.description = "Technology and programming books"
end

biography = Category.find_or_create_by!(name: "Biography") do |category|
  category.description = "Life stories of notable people"
end

# Create authors
authors_data = [
  { name: "Gabriel García Márquez", bio: "Colombian novelist and Nobel Prize winner, known for magical realism." },
  { name: "Isabel Allende", bio: "Chilean-American writer known for novels rooted in magical realism." },
  { name: "Yuval Noah Harari", bio: "Israeli historian and author of popular science books." },
  { name: "Martin Fowler", bio: "British software developer, author and international public speaker on software development." },
  { name: "Robert C. Martin", bio: "American software engineer and instructor, known as Uncle Bob." },
  { name: "Michelle Obama", bio: "Former First Lady of the United States and bestselling author." },
  { name: "Walter Isaacson", bio: "American author, journalist, and professor." }
]

authors = {}
authors_data.each do |author_data|
  authors[author_data[:name]] = Author.find_or_create_by!(name: author_data[:name]) do |author|
    author.bio = author_data[:bio]
  end
end

# Create books
books_data = [
  {
    title: "One Hundred Years of Solitude",
    isbn: "978-0-06-088328-7",
    author: "Gabriel García Márquez",
    category: fiction,
    publication_date: Date.new(1967, 5, 30),
    description: "A multi-generational saga of the Buendía family in the fictional town of Macondo."
  },
  {
    title: "The House of the Spirits",
    isbn: "978-0-553-38356-7",
    author: "Isabel Allende",
    category: fiction,
    publication_date: Date.new(1982, 1, 1),
    description: "The story of the del Valle and Trueba families spans four generations."
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    isbn: "978-0-06-231609-7",
    author: "Yuval Noah Harari",
    category: non_fiction,
    publication_date: Date.new(2011, 1, 1),
    description: "An exploration of how Homo sapiens conquered the world."
  },
  {
    title: "Refactoring: Improving the Design of Existing Code",
    isbn: "978-0-201-48567-7",
    author: "Martin Fowler",
    category: technology,
    publication_date: Date.new(1999, 7, 8),
    description: "A guide to improving software design through refactoring techniques."
  },
  {
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    isbn: "978-0-13-235088-4",
    author: "Robert C. Martin",
    category: technology,
    publication_date: Date.new(2008, 8, 1),
    description: "A guide to writing clean, maintainable code."
  },
  {
    title: "Becoming",
    isbn: "978-1-5247-6313-8",
    author: "Michelle Obama",
    category: biography,
    publication_date: Date.new(2018, 11, 13),
    description: "The intimate memoir of the former First Lady of the United States."
  },
  {
    title: "Steve Jobs",
    isbn: "978-1-4516-4853-9",
    author: "Walter Isaacson",
    category: biography,
    publication_date: Date.new(2011, 10, 24),
    description: "The exclusive biography of Apple's co-founder."
  },
  {
    title: "21 Lessons for the 21st Century",
    isbn: "978-0-525-51213-7",
    author: "Yuval Noah Harari",
    category: non_fiction,
    publication_date: Date.new(2018, 8, 21),
    description: "How to navigate the challenges of the 21st century."
  }
]

books_data.each do |book_data|
  Book.find_or_create_by!(isbn: book_data[:isbn]) do |book|
    book.title = book_data[:title]
    book.author = authors[book_data[:author]]
    book.category = book_data[:category]
    book.publication_date = book_data[:publication_date]
    book.description = book_data[:description]
    book.available = true
  end
end

puts "Seeded #{Category.count} categories"
puts "Seeded #{Author.count} authors"
puts "Seeded #{Book.count} books"
