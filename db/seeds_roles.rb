# Create users with different roles for testing

# Create a librarian user
librarian = User.find_or_create_by(email: 'librarian@libragenie.com') do |user|
  user.password = 'password123'
  user.password_confirmation = 'password123'
  user.role = 'librarian'
end

puts "✅ Librarian created: #{librarian.email} (#{librarian.role})"

# Create an admin user
admin = User.find_or_create_by(email: 'admin@libragenie.com') do |user|
  user.password = 'password123'
  user.password_confirmation = 'password123'
  user.role = 'admin'
end

puts "✅ Admin created: #{admin.email} (#{admin.role})"

# Update existing user to be a borrower (if any exists)
first_user = User.where(role: 'borrower').first
if first_user
  puts "✅ Existing borrower: #{first_user.email} (#{first_user.role})"
else
  borrower = User.find_or_create_by(email: 'borrower@libragenie.com') do |user|
    user.password = 'password123'
    user.password_confirmation = 'password123'
    user.role = 'borrower'
  end
  puts "✅ Borrower created: #{borrower.email} (#{borrower.role})"
end

puts "\n🎯 Test users ready:"
puts "📚 Librarian: librarian@libragenie.com / password123"
puts "👑 Admin: admin@libragenie.com / password123"
puts "👤 Borrower: borrower@libragenie.com / password123"
