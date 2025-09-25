import { Instagram, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <div className="bg-white mt-auto py-4 shadow-border">
      <div className="flex w-4xl mx-auto justify-between">
        <p>Desenvolvido por Bruno Azevedo</p>
        <div className="flex gap-4">
          <a href="https://www.instagram.com/azvd.bruno" target="_blank">
            <Instagram />
          </a>
          <a href="https://www.linkedin.com/in/brunoazvdo/" target="_blank">
            <Linkedin />
          </a>
          <a href="mailto:brunoazvd@protonmail.com" target="_blank">
            <Mail />
          </a>
        </div>
      </div>
    </div>
  );
};
