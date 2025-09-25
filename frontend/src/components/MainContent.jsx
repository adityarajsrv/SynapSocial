/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { 
  RiTwitterXLine as TwitterIcon, 
  RiInstagramLine as InstagramIcon, 
  RiAddLine,
  RiMagicLine,
  RiTimeLine,
  RiArrowRightLine,
  RiLinkedinFill as LinkedInIcon,
  RiArrowUpLine,
  RiArrowDownLine,
  RiDeleteBinLine,
  RiLink,
  RiEmotionSadLine,
} from "@remixicon/react";

const MainContent = ({ userName }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [todos, setTodos] = useState([
    { id: 1, text: "Review draft post", completed: false, priority: "medium" },
    { id: 2, text: "Approve 2 pending posts", completed: false, priority: "high" },
    { id: 3, text: "Schedule weekly content", completed: false, priority: "medium" }
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [connectedAccounts, setConnectedAccounts] = useState([
    { id: 1, platform: "twitter", connected: true, username: "@flowforge", followers: "2.4K" },
    { id: 2, platform: "instagram", connected: true, username: "@flowforge.studio", followers: "1.2K" },
    { id: 3, platform: "facebook", connected: true, username: "@flowforgepage", followers: "3.7K" }
  ]);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const newTodoItem = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        priority: "medium"
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const connectAccount = (platform) => {
    setConnectedAccounts(prev => [...prev, { 
      id: Date.now(), 
      platform, 
      connected: true, 
      username: `@${platform}user`,
      followers: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 9)}K`
    }]);
  };

  const disconnectAccount = (id) => {
    setConnectedAccounts(prev => prev.filter(account => account.id !== id));
  };

  const platforms = [
    {
      name: "Flow Forge",
      handle: "@flowforge",
      platform: "twitter",
      metric: "3.2%",
      label: "Engagement",
      change: "+0.4%",
      trend: "up"
    },
    {
      name: "Flow Forge",
      handle: "@flowforge.studio",
      platform: "instagram",
      metric: "21.4k",
      label: "Reach (Last Week)",
      change: "+2.1k",
      trend: "up"
    },
    {
      name: "Flow Forge",
      handle: "@flowforgepage",
      platform: "linkedin",
      metric: "2.9%",
      label: "Page Reach",
      change: "-0.3%",
      trend: "down"
    }
  ];

  const recentPosts = [
    {
      id: 1,
      platform: "twitter",
      handle: "@flowforge",
      content: "We've just wrapped an incredible project with one of our long-term clients. Proud of how our team pushed the boundaries of design and execution...",
      time: "2 hours ago",
      engagement: "245 likes • 42 comments",
      metrics: { likes: 245, comments: 42, shares: 12 }
    },
    {
      id: 2,
      platform: "instagram",
      handle: "@flowforge.studio",
      content: "Behind-the-scenes: brainstorming sessions don't always look pretty, but they always spark magic. ✨",
      time: "5 hours ago",
      engagement: "1.2K likes • 89 comments",
      metrics: { likes: 1200, comments: 89, shares: 34 }
    },
    {
      id: 3,
      platform: "linkedin",
      handle: "@flowforgepage",
      content: "Excited to announce our new partnership with TechInnovate! Together we're pushing the boundaries of digital transformation.",
      time: "1 day ago",
      engagement: "567 likes • 23 shares",
      metrics: { likes: 567, comments: 45, shares: 23 }
    }
  ];

  const PlatformIcon = ({ platform, size = 20 }) => {
    const icons = {
      twitter: TwitterIcon,
      instagram: InstagramIcon,
      linkedin: LinkedInIcon,
    };
    const Icon = icons[platform] || TwitterIcon;
    const colors = {
      twitter: "text-black",
      instagram: "text-pink-500",
      linkedin: "text-blue-600",
    };
    
    return <Icon className={`w-${size} h-${size} ${colors[platform]}`} />;
  };

  const TrendIndicator = ({ trend, change }) => (
    <div className={`flex items-center text-xs font-medium ${
      trend === 'up' ? 'text-green-500' : 'text-red-500'
    }`}>
      {trend === 'up' ? <RiArrowUpLine className="w-3 h-3 mr-1" /> : <RiArrowDownLine className="w-3 h-3 mr-1" />}
      {change}
    </div>
  );

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const hasConnectedAccounts = connectedAccounts.length > 0;

  return (
    <div className="min-h-full bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Snapshot</h1>
        <p className="text-gray-600">Track how your brand is performing across platforms.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Social Media Overview</h2>
              {hasConnectedAccounts && (
                <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  {connectedAccounts.length} accounts connected
                </span>
              )}
            </div>

            {hasConnectedAccounts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {platforms.map((platform, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <PlatformIcon platform={platform.platform} size={24} />
                        <div>
                          <p className="font-semibold text-gray-900">{platform.name}</p>
                          <p className="text-sm text-gray-500">{platform.handle}</p>
                        </div>
                      </div>
                      <TrendIndicator trend={platform.trend} change={platform.change} />
                    </div>
                    
                    <div className="flex items-end justify-between mt-4">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{platform.metric}</p>
                        <p className="text-sm text-gray-600">{platform.label}</p>
                      </div>
                      <button className="text-blue-500 hover:text-blue-600 text-sm font-medium cursor-pointer">
                        View Insights →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <RiEmotionSadLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No accounts connected yet</h3>
                <p className="text-gray-500 mb-6">Connect your social media accounts to see performance insights</p>
                <button 
                  onClick={() => connectAccount('twitter')}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 mx-auto"
                >
                  <RiLink className="w-5 h-5" />
                  <span>Connect Your First Account</span>
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Posts</h3>
              <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                View All Posts →
              </button>
            </div>
            
            {hasConnectedAccounts ? (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <PlatformIcon platform={post.platform} size={20} />
                        <div>
                          <p className="font-medium text-gray-900">{post.handle}</p>
                          <p className="text-xs text-gray-500">{post.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {post.metrics.likes} likes
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                      {post.content}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>❤️ {post.metrics.likes} likes</span>
                        <span>💬 {post.metrics.comments} comments</span>
                        <span>🔄 {post.metrics.shares} shares</span>
                      </div>
                      <button className="text-blue-500 hover:text-blue-600 cursor-pointer text-sm font-medium">
                        View Analytics →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <RiEmotionSadLine className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Connect accounts to see your recent posts</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 cursor-pointer text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2">
                <RiAddLine className="w-5 h-5" />
                <span>Create Post</span>
              </button>
              <button className="w-full bg-gray-100 cursor-pointer text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                <RiMagicLine className="w-5 h-5" />
                <span>AI Generate</span>
              </button>
              <button className="w-full bg-gray-100 cursor-pointer text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                <RiTimeLine className="w-5 h-5" />
                <span>Schedule</span>
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button 
                onClick={() => connectAccount('twitter')}
                className="w-full text-blue-500 cursor-pointer hover:text-blue-600 font-medium flex items-center justify-center space-x-2"
              >
                <span>Connect New Account</span>
                <RiArrowRightLine className="w-4 h-4" />
              </button>
              <p className="text-center text-sm text-gray-500 mt-2">
                {hasConnectedAccounts ? `${connectedAccounts.length} accounts connected` : 'No accounts connected'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Connected Accounts</h3>
            {hasConnectedAccounts ? (
              <div className="space-y-3">
                {connectedAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <PlatformIcon platform={account.platform} size={20} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 capitalize truncate">
                          {account.platform}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{account.username}</p>
                        <p className="text-xs text-gray-400">{account.followers} followers</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => disconnectAccount(account.id)}
                      className="text-red-500 hover:text-red-700 p-2 ml-3 rounded-lg text-xs cursor-pointer hover:bg-red-50 transition-colors"
                      title="Disconnect account"
                    >
                        Disconnect
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <RiLink className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No accounts connected yet</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">To Do</h3>
              <span className="text-sm text-gray-500">
                {completedCount}/{totalCount} completed
              </span>
            </div>
            <div className="flex mb-4">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new task..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={addTodo}
                className="bg-blue-500 text-white cursor-pointer px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Add
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {todos.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No tasks yet. Add one above!</p>
              ) : (
                todos.map((todo) => (
                  <div key={todo.id} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className={`text-sm flex-1 ${
                        todo.completed 
                          ? 'line-through text-gray-400' 
                          : 'text-gray-700'
                      }`}>
                        {todo.text}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 cursor-pointer text-red-500 hover:text-red-700 transition-opacity p-1"
                    >
                      <RiDeleteBinLine className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            {completedCount > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <button
                  onClick={clearCompleted}
                  className="w-full text-red-500 cursor-pointer hover:text-red-700 text-sm font-medium py-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Clear Completed ({completedCount})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;