"use client"

import { Instagram, Facebook, Twitter, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-primary text-primary-foreground py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Photography Studio</h3>
                        <p className="text-primary-foreground/80 mb-4">
                            Capturing life's most precious moments with artistry and passion.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-primary-foreground/80 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-primary-foreground/80 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-primary-foreground/80 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-primary-foreground/80 transition-colors">
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-semibold mb-4">Services</h4>
                        <ul className="space-y-2 text-primary-foreground/80">
                            <li><a href="#" className="hover:text-primary-foreground transition-colors">Wedding Photography</a></li>
                            <li><a href="#" className="hover:text-primary-foreground transition-colors">Portrait Sessions</a></li>
                            <li><a href="#" className="hover:text-primary-foreground transition-colors">Event Photography</a></li>
                            <li><a href="#" className="hover:text-primary-foreground transition-colors">Commercial Photography</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold mb-4">Contact Info</h4>
                        <div className="space-y-2 text-primary-foreground/80">
                            <p>testingphotographer@gmail.com</p>
                            <p>+234 904 123 4567</p>
                            <p>Alalubosa, Owode Oyo, Oyo state.</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/80">
                    <p>&copy; 2025 RelixCore Photography Studio. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}