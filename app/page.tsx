import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <p>This is a Test page</p>
      <div>
        <Link href="/about" >about</Link>
      </div>
      <Link href="/designer">Designer</Link>
    </div>
  );
}
