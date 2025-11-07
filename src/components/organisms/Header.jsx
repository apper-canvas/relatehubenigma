import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/layouts/Root";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onAddContact, onAddDeal, onAddTask }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const { user, isAuthenticated } = useSelector(state => state.user);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'BarChart3' },
    { name: 'Contacts', href: '/contacts', icon: 'Users' },
    { name: 'Pipeline', href: '/pipeline', icon: 'GitBranch' },
    { name: 'Tasks', href: '/tasks', icon: 'CheckSquare' },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="bg-surface border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              R
            </div>
            <h1 className="text-xl font-bold text-secondary">RelateHub</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary text-white'
                    : 'text-secondary hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ApperIcon name={item.icon} size={16} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Quick Add Buttons */}
            <div className="hidden lg:flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddContact}
                className="text-xs"
              >
                <ApperIcon name="UserPlus" size={14} />
                <span className="ml-1">Contact</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddDeal}
                className="text-xs"
              >
                <ApperIcon name="Handshake" size={14} />
                <span className="ml-1">Deal</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddTask}
                className="text-xs"
              >
                <ApperIcon name="Plus" size={14} />
                <span className="ml-1">Task</span>
              </Button>
            </div>

            {/* User Menu */}
            {isAuthenticated && user && (
              <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-secondary">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.emailAddress}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <ApperIcon name="LogOut" size={16} />
                  <span className="ml-1 hidden sm:inline">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;