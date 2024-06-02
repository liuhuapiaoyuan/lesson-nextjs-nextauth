export default function LoginBindPage() {
  return (
    <div>
      <h1>您的账号还未创建</h1>
      <p>请先创建您的账号，然后绑定您的账号。</p>
      <form>
        <input type="text" placeholder="请输入您的用户名" />
        <input type="email" placeholder="输入您的密码" />
        <button type="submit">绑定账号</button>
      </form>
      <button>不，我要直接创建新账号</button>
    </div>
  );
}
