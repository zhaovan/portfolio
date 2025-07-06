import React from "react";
import PageContent from "./PageContent";
import { Metadata } from "next";
import projects from "@/app/data/projects.json";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  const project = projects.find((project) => project.slug === slug);

  return {
    title: `Ivan Zhao | ${project!.name}`,
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <PageContent />
    </div>
  );
}
