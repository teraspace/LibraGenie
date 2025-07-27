// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"

// React imports
import React from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom'
import BookForm from './components/BookForm'
import BookFormAdvanced from './components/BookFormAdvanced'
import BooksList from './components/BooksList'
import Dashboard from './components/Dashboard'
import SearchBooks from './components/SearchBooks'
import AuthorsList from './components/AuthorsList'
import AuthorForm from './components/AuthorForm'
import AuthorDetail from './components/AuthorDetail'
import CategoriesList from './components/CategoriesList'
import CategoryDetail from './components/CategoryDetail'
import CategoryForm from './components/CategoryForm'
import LoansList from './components/LoansList'
import LoanForm from './components/LoanForm'

// Make React components available globally
window.React = React
window.ReactDOM = ReactDOM
window.createRoot = createRoot
window.BookForm = BookForm
window.BookFormAdvanced = BookFormAdvanced
window.BooksList = BooksList
window.Dashboard = Dashboard
window.SearchBooks = SearchBooks
window.AuthorsList = AuthorsList
window.AuthorForm = AuthorForm
window.AuthorDetail = AuthorDetail
window.CategoriesList = CategoriesList
window.CategoryDetail = CategoryDetail
window.CategoryForm = CategoryForm
window.LoansList = LoansList
window.LoanForm = LoanForm

// Helper function for React rendering (compatible with React 19+)
window.renderReactComponent = function(component, container, componentName = 'Component') {
  if (!container) {
    console.error('❌ Container is null or undefined for', componentName);
    return false;
  }

  // Use ReactRootManager if available, otherwise fallback to direct creation
  if (window.ReactRootManager) {
    console.log('🔧 Using ReactRootManager for', componentName);
    const root = window.ReactRootManager.getOrCreateRoot(container, componentName);
    if (root) {
      root.render(component);
      return true;
    } else {
      console.error('❌ Failed to get React root for', componentName);
      return false;
    }
  }

  // Fallback to direct root creation
  console.log('⚠️ ReactRootManager not available, using direct root creation');
  try {
    if (window.createRoot) {
      console.log('Using React 19 createRoot from client');
      const root = window.createRoot(container);
      root.render(component);
      return true;
    } else if (window.ReactDOM && window.ReactDOM.createRoot) {
      console.log('Using ReactDOM.createRoot');
      const root = window.ReactDOM.createRoot(container);
      root.render(component);
      return true;
    } else if (window.ReactDOM && window.ReactDOM.render) {
      console.log('Using legacy ReactDOM.render');
      window.ReactDOM.render(component, container);
      return true;
    } else {
      console.error('ReactDOM not available');
      return false;
    }
  } catch (error) {
    console.error('❌ Error in renderReactComponent:', error);
    return false;
  }
}
