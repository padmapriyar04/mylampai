import React from 'react';
import Footer from '@/components/home/Footer';

import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Read() {
    return (
        <div className="flex flex-col min-h-screen bg-[#FFFF]">
            <div className="flex flex-1">
                {/* Left Sidebar */}
                <div className="w-[20%] hidden md:block p-4 my-10">
                    <div className="relative text-md font-bold mb-6 flex justify-center items-center text-[#8C52FF]">
                        <span className="relative z-10 mb-2">Table of Contents</span>
                        <span className="absolute bottom-0 left-0 w-full h-[1.6px] bg-[#8C52FF]" style={{ width: 'calc(90% - 1rem)', left: '1.5rem' }}></span>
                    </div>
                    <ul className="list-none txt-sm flex flex-col items-center space-y-4 border-2 border-b-red-400">
                        <li>Lorem Ipsum</li>
                        <li>Lorem Ipsum</li>
                        <li>Lorem Ipsum</li>
                        <li>Lorem Ipsum</li>
                        <li>Lorem Ipsum</li>
                        <li className=''>Lorem Ipsum</li>
                    </ul>
                    <div className="flex justify-center space-x-4 mt-6 w-full">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#8C52FF]">
                            <FaFacebookF size={20} color='black'  />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#8C52FF]">
                            <FaTwitter size={20} color='black' />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#8C52FF]">
                            <FaInstagram size={20} color='black' />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#8C52FF]">
                            <FaLinkedinIn size={20} color='black'/>
                        </a>
                    </div>
                </div>


                {/* Main Content Area */}
                <div className="w-[60%] px-6 lg:px-[60px] xl:px-[100px] my-8 bg-[#FFFFFF] relative">
                    <div id="allroundassistance" className="pb-[30px] sm:pb-[50px]">
                        <div className="text-2xl sm:text-3xl font-medium mt-4 mb-2">
                            Why Choose WordPress?
                        </div>
                        <p className="text-sm sm:text-lg text-[#000000BB] font-medium my-4">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet nam nobis tenetur vitae placeat inventore, doloremque atque facere molestias doloribus assumenda officiis suscipit hic! Ipsa sit neque eligendi magni explicabo ab, non modi maxime!
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium earum culpa, non corrupti fugit, accusamus animi amet cupiditate illo iste placeat, expedita aut nam eos fugiat! Totam facilis repellat ut ipsam dicta, illum optio sunt accusamus, et tenetur expedita atque possimus? Corrupti ut sed consequuntur sunt, laborum veniam repellat odit nihil perferendis debitis provident maxime assumenda aspernatur quia itaque alias, veritatis accusamus, consectetur deserunt eos voluptate nostrum! Deleniti corrupti amet iure consectetur modi sunt incidunt deserunt ab? Ipsam vitae at eveniet, rem vel possimus dolorum officiis nostrum deleniti minus reprehenderit.
                        </p>
                    </div>
                    <div id="smartestplatform" className="pb-[30px] sm:pb-[50px]">
                        <div className="text-2xl sm:text-3xl font-medium mt-4 mb-2">
                            WordPress Developer Roadmap (Step-By-Step)
                        </div>
                        <p className="text-sm sm:text-lg text-[#000000BB] font-medium my-4">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus laudantium tenetur, dicta quae qui cum obcaecati rerum sit? Officia iusto explicabo dolores! Est iure quos saepe aliquam magni accusantium voluptates voluptatem incidunt. Eveniet, perferendis.
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis architecto, tempora suscipit quod culpa exercitationem! Aliquam iste sapiente maiores, totam natus quasi dignissimos perferendis iusto animi odio ipsam dolorem dolorum molestiae quo in repellendus similique ipsum optio laborum ea ullam placeat excepturi. Eum totam ipsum similique tenetur dicta repellat architecto consequatur! Corporis facilis illo sapiente sequi debitis pariatur, delectus esse asperiores ipsa, recusandae laudantium iusto! Corporis explicabo, aspernatur debitis quidem mollitia iure pariatur omnis animi maiores, laboriosam eos repellat fuga atque nostrum ducimus nesciunt dolore fugiat asperiores. Labore, incidunt obcaecati!
                        </p>
                    </div>
                    <div id="ourwinningrecord">
                        <div className="text-2xl sm:text-3xl font-medium mt-4 mb-2">
                            Conclusion
                        </div>
                        <p className="text-sm sm:text-lg text-[#000000BB] font-medium my-4">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti ab aspernatur expedita! Provident unde eos a non tempora sit ducimus repellendus officia magnam debitis. Magni ipsam veniam vel est nostrum deleniti consequuntur sunt rem!
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet quas quasi suscipit mollitia architecto animi dicta debitis odio praesentium provident excepturi quia nostrum maiores aut, voluptas, aliquam nemo unde commodi cupiditate. Dolorum deserunt culpa, nulla ratione saepe commodi ea hic voluptatibus sit officiis magnam tempore iste tempora ex consectetur quis dolore beatae nobis! Dignissimos odio voluptatibus esse cupiditate iusto non, tempora odit quam. Accusantium cum nihil cumque iusto quam nobis explicabo saepe magni, labore minima, blanditiis ut tempore. Deleniti id ullam cum tempora perspiciatis maxime maiores temporibus perferendis ad illum!
                        </p>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-[20%] bg-red-500 hidden md:block p-4">
                    {/* Sidebar content */}
                    lhfdiuhvfihvdgi
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
