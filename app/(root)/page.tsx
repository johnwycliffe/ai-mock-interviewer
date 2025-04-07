import { Button } from '@/components/ui/button';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // ✅ Import Link from next/link
import { dummyInterviews } from '@/constants';
import InterviewCard from '@/components/InterviewCard';

const Page = () => {
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>

          <p className="text-lg">
            Practice on real interview questions & get instant feedback
          </p>

          {/* ✅ Corrected Button with Link */}
          <Button asChild className="btn bg-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link> 
          </Button>
        </div>

        {/* ✅ Ensure Image is used correctly */}
        <Image 
          src="/robot.png" 
          alt="robo" 
          width={400} 
          height={400} 
          className="max-sm:hidden" 
        />
      </section>
      <section className='flex-col gap-6 mt-8'>
        <h2> Your Interviews </h2>
       <div className='interviews-section'>
         {dummyInterviews.map((interview) => (
            <InterviewCard { ... interview}
            key={interview.id}/>
         ))}
       </div>
      </section>
      <section className='flex flex-col gap-6 mt-8'>
        <h2> Take an Interview</h2>
        <div className='interviews-section'>
           {dummyInterviews.map((interview) => (
            <InterviewCard { ... interview}
             key={interview.id}/>
         ))}
         {/* <p> you haven&apos;t taken any interviews yet </p> */}        </div>
      </section>
    </>
  );
};

export default Page;
