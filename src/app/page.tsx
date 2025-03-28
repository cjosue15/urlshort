import ShortForm from './components/ShortForm';
import ShortGrid from './components/ShortGrid';

export default function Home() {
  return (
    <main className='mt-12'>
      <div className='max-w-4xl mx-auto p-4'>
        <h1 className='text-4xl text-center mb-4'>
          <span className='font-bold'>URL</span>short
        </h1>

        <p className='text-center mb-4'>Crate shortened URLs.</p>

        <ShortForm />

        <ShortGrid />
      </div>
    </main>
  );
}
