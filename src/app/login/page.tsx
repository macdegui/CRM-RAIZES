import LoginForm from '@/components/ui/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">CRM Raízes</h1>
          <p className="text-gray-400 text-sm mt-1">Pão de mel do Henrique</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
