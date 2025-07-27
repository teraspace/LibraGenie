FactoryBot.define do
  factory :loan do
    user { nil }
    book { nil }
    borrowed_at { "2025-07-25 17:27:37" }
    returned_at { "2025-07-25 17:27:37" }
    due_date { "2025-07-25 17:27:37" }
  end
end
