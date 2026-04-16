"use client";

import { useEffect } from "react";
import "./client-component.css";
import data from './json/data.json';
import { serverFunc } from '../utils/server-action';
import { getServerData } from '../utils/server-only';

export default function ClientComponent() {
  useEffect(() => {
    const observer = new IntersectionObserver(() => {
      //
    });

    const resizeObserver = new ResizeObserver(() => {
      //
    });

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  const cloned = structuredClone(data);
  getServerData();
  console.log(cloned);

  const onClick = async () => {
    await serverFunc();
  }

  return (
    <button onClick={onClick} type="button">click</button>
  );
}
