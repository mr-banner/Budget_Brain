import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/LandingConstant";
import React from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const Home = () => {
  return (
    <>
      <section className="md:py-20 py-15 bg-blue-50">
        <div className="inline-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stats, index) => (
              <div key={index} className="text-center">
                <h4 className="text-4xl font-bold text-primary mb-2">
                  {stats.value}
                </h4>
                <p className="text-gray-600">{stats.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="md:py-20 py-15">
        <div className="inline-padding">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to manage your finance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <Card className="p-6" key={index}>
                <CardContent className="space-y-4 pt-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="rext-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="md:py-20 py-15 bg-blue-50">
        <div className="inline-padding">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksData.map((data, index) => (
              <div className="text-center" key={index}>
                <div className="w-16 h-16 bg-primary rounded-full flex mx-auto items-center justify-center mb-6 ">
                  {data.icon}
                </div>
                <h2 className="text-primary text-xl font-semibold mb-4">
                  {data.title}
                </h2>
                <p className="text-gray-600">{data.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="md:py-20 py-15">
        <div className="inline-padding">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Usres Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <Card className="p-6" key={index}>
                <CardContent className="pt-4">
                  <div className="flex items-center mb-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="ml-5">
                      <h5 className="text-lg text-primary font-semibold">
                        {testimonial.name}
                      </h5>
                      <p className="text-gray-400 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600">{testimonial.quote}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="md:py-20 py-15 bg-primary">
        <div className="inline-padding text-center">
          <h2 className="text-3xl font-bold text-white pb-4">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-white max-w-2xl mx-auto mb-8">Join thousands of users who are already managing their finances
            smarter with Welth</p>
            <Link href={"/dashboard"}>
              <Button size={"lg"}
              className="bg-white text-primary text-lg px-6 py-4 animate-bounce cursor-pointer hover:bg-white shadow hover:shadow-2xl hover:shadow-blue-50"
              >
                Start Free Trial
              </Button>
            </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
