Rails.application.routes.draw do
  devise_for :users
  root 'home#dashboard_react'
  get 'dashboard', to: 'home#dashboard'
  get 'dashboard_react', to: 'home#dashboard_react'
  get 'dashboard_data', to: 'home#dashboard_data'

  # Serve assets from builds directory
  get '/assets/builds/*file', to: 'application#serve_asset'

  resources :books do
    member do
      post :borrow
      patch :return_book
    end

    # React versions for comparison
    collection do
      get :new_react
      get :index_react
      get :validate_isbn
    end
  end

  resources :authors do
    collection do
      get :index_react
      get :new_react
    end
    member do
      get :show_react
      get :edit_react
    end
  end
  resources :categories do
    collection do
      get :index_react
      get :new_react
    end
    member do
      get :show_react
      get :edit_react
    end
  end

  resources :loans do
    collection do
      get :index_react
      get :new_react
    end
    member do
      patch :return_book
    end
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
end
