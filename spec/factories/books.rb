FactoryBot.define do
  factory :book do
    title { "MyString" }
    isbn { "MyString" }
    description { "MyText" }
    publication_date { "2025-07-25" }
    available { false }
    author { nil }
    category { nil }
  end
end
