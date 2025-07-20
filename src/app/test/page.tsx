export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">Tailwind CSS 测试页面</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">卡片 1</h2>
            <p className="text-gray-600">这是一个测试卡片，用于验证 Tailwind CSS 样式是否正常加载。</p>
            <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              测试按钮
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">卡片 2</h2>
            <p className="text-gray-600">如果这个卡片显示正常，说明 Tailwind CSS 配置正确。</p>
            <button className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              成功按钮
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">卡片 3</h2>
            <p className="text-gray-600">检查颜色、间距、阴影等样式是否正常显示。</p>
            <button className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
              警告按钮
            </button>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
          <h3 className="text-2xl font-bold mb-2">渐变背景测试</h3>
          <p>如果这个渐变背景显示正常，说明 CSS 变量和渐变功能正常。</p>
        </div>
      </div>
    </div>
  )
} 