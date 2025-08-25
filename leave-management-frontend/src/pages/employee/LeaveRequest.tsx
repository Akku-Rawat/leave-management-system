import React from "react";

interface LeaveRequestProps {
  setActiveView?: (view: string) => void;
}

const LeaveRequest: React.FC<LeaveRequestProps> = ({ setActiveView }) => (
  <>
    {/* Main Container Card */}
    <div className="bg-white p-8 rounded-2xl shadow-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Apply Leave</h2>
        <p className="text-gray-600">
          Here’s an overview of your leave status and quick actions.
        </p>
      </div>

      {/* 👇 Ye poora tumhara diya hua cards wala code */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Leave Balance */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Leave Balance</p>
              <p className="text-2xl font-bold text-gray-900">30Days</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-calendar-days text-blue-600"></i>
            </div>
          </div>
        </div>
        {/* Used This Year */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Used This Year</p>
              <p className="text-2xl font-bold text-gray-900">10 Days</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fas fa-check-circle text-green-600"></i>
            </div>
          </div>
        </div>
        {/* Pending Requests */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <i className="fas fa-clock text-yellow-600"></i>
            </div>
          </div>
        </div>
        {/* Remaining */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Remaining</p>
              <p className="text-2xl font-bold text-gray-900">20</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="fas fa-hourglass-half text-purple-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => setActiveView && setActiveView("applyleave")}
              className="w-full flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <i className="fas fa-plus text-blue-600 mr-3"></i>
              <span className="text-gray-700">Apply for Leave</span>
            </button>
            <button
              onClick={() => setActiveView && setActiveView("history")}
              className="w-full flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i className="fas fa-eye text-gray-600 mr-3"></i>
              <span className="text-gray-700">View Leave History</span>
            </button>
            {/* <button
              className="w-full flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <i className="fas fa-chart-bar text-green-600 mr-3"></i>
              <span className="text-gray-700">Check Leave Balance</span>
            </button> */}
          </div>
        </div>

        {/* Recent Activities */}
        {/* <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activities
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-check text-green-600 text-xs"></i>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Leave request approved</p>
                <p className="text-xs text-gray-500">
                  Annual Leave (Dec 20-22) • 2 days ago
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-paper-plane text-blue-600 text-xs"></i>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  New leave request submitted
                </p>
                <p className="text-xs text-gray-500">
                  Sick Leave (Jan 15-16) • 5 days ago
                </p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  </>
);

export default LeaveRequest;
