class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end

  def serve_asset
    file_path = params[:file]
    full_path = Rails.root.join('app', 'assets', 'builds', file_path)

    if File.exist?(full_path)
      content_type = case File.extname(file_path)
                    when '.js' then 'application/javascript'
                    when '.css' then 'text/css'
                    when '.map' then 'application/json'
                    else 'text/plain'
                    end

      send_file full_path, type: content_type, disposition: 'inline'
    else
      head :not_found
    end
  end
end
