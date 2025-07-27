module RoleAuthorization
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_user!
  end

  private

  def require_librarian_or_admin
    unless current_user.can_manage_books?
      respond_to do |format|
        format.html { redirect_to root_path, alert: 'Access denied. Librarian or Admin role required.' }
        format.json { render json: { error: 'Access denied. Librarian or Admin role required.' }, status: :forbidden }
      end
    end
  end

  def require_admin
    unless current_user.can_manage_users?
      respond_to do |format|
        format.html { redirect_to root_path, alert: 'Access denied. Admin role required.' }
        format.json { render json: { error: 'Access denied. Admin role required.' }, status: :forbidden }
      end
    end
  end

  def require_librarian_or_owner(resource_user)
    unless current_user.can_view_all_loans? || current_user == resource_user
      respond_to do |format|
        format.html { redirect_to root_path, alert: 'Access denied. You can only view your own resources.' }
        format.json { render json: { error: 'Access denied. You can only view your own resources.' }, status: :forbidden }
      end
    end
  end
end
