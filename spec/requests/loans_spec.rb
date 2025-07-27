require 'rails_helper'

RSpec.describe "Loans", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/loans/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/loans/show"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /new" do
    it "returns http success" do
      get "/loans/new"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/loans/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /edit" do
    it "returns http success" do
      get "/loans/edit"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/loans/update"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /destroy" do
    it "returns http success" do
      get "/loans/destroy"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /borrow" do
    it "returns http success" do
      get "/loans/borrow"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /return" do
    it "returns http success" do
      get "/loans/return"
      expect(response).to have_http_status(:success)
    end
  end

end
