import { Instagram, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <div className="bg-white mt-auto py-4 shadow-border border-t-2 border-primary">
      <div className="flex w-4xl mx-auto justify-between">
        <p>Desenvolvido por Bruno Azevedo</p>
        <div className="flex gap-4">
          <a
            href="https://www.instagram.com/azvd.bruno"
            target="_blank"
            className="hover:text-primary"
          >
            <Instagram />
          </a>
          <a
            href="https://www.linkedin.com/in/brunoazvdo/"
            target="_blank"
            className="hover:text-primary"
          >
            <Linkedin />
          </a>
          <a
            href="mailto:brunoazvd@protonmail.com"
            target="_blank"
            className="hover:text-primary"
          >
            <Mail />
          </a>
        </div>
      </div>
    </div>
  );
};
